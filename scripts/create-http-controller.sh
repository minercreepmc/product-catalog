#!/bin/bash

# Check if a controller name was provided
if [ -z "$1" ]; then
	echo "Please provide a controller name."
	exit 1
fi

# Set up variables
controller_name="$1"
dir_name="$(echo "$controller_name" | sed 's/\([A-Z]\)/-\1/g' | tr '[:upper:]' '[:lower:]' | sed 's/^-//')"

echo "Creating controller: $controller_name"

base_path="./src/interface-adapters/controllers/http/${dir_name}"

# Create directories
mkdir -p "${base_path}"

# Create files
touch "${base_path}/index.ts"
touch "${base_path}/${dir_name}.http.controller.ts"
touch "${base_path}/${dir_name}.http.request.ts"
touch "${base_path}/${dir_name}.http.response.ts"

cat >"${base_path}/index.ts" <<EOL
export * from './${dir_name}.http.controller';
export * from './${dir_name}.http.request';
export * from './${dir_name}.http.response';
EOL

cat >"${base_path}/${dir_name}.http.controller.ts" <<EOL
@Controller('path')
export class ${controller_name}HttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('${dir_name}')
  @HttpCode()
  async execute(@Body() dto: ${controller_name}HttpRequest) {
    const command = new ${controller_name}Command(dto);
    const result = await this.commandBus.execute(command);
    return match(result, {
      Ok: (response: ${controller_name}ResponseDto) =>
        new ${controller_name}HttpResponse(response),
      Err: (exception: Error) => {
        if (exception instanceof UseCaseCommandValidationExceptions) {
          throw new UnprocessableEntityException(exception.exceptions);
        }
        if (exception instanceof UseCaseProcessExceptions) {
          throw new ConflictException(exception.exceptions);
        }
        throw exception;
      },
    });
  }
}
EOL

cat >"${base_path}/${dir_name}.http.request.ts" <<EOL
export class ${controller_name}HttpRequest { }
EOL

cat >"${base_path}/${dir_name}.http.response.ts" <<EOL
export class ${controller_name}HttpResponse { }
EOL

echo "HTTP controller '${controller_name}' directory structure created."
