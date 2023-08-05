#!/bin/bash

if [ "$#" -ne 2 ]; then
	echo "Usage: $0 <UseCaseName> <TargetDirectory>"
	exit 1
fi

use_case_name="$1"
target_directory="$2"

dir_name="$(echo "$use_case_name" | sed -e 's/\([A-Z]\)/-\L\1/g' -e 's/^-//')"
camel_case_dir_name="$(echo "$dir_name" | sed -r 's/(-)([a-z])/\U\2/g')"
handler_file="$target_directory/$dir_name.handler.ts"

cat <<EOF >"$handler_file"
@CommandHandler(${use_case_name}Command)
export class ${use_case_name}Handler
  implements ICommandHandler<${use_case_name}Command, ${use_case_name}Result> {
  constructor(
    private readonly validator: ${use_case_name}Validator,
    private readonly ${camel_case_dir_name}Process: ${use_case_name}Process,
    private readonly mapper: ${use_case_name}Mapper,
  ) {}

  async execute(command: ${use_case_name}Command): Promise<${use_case_name}Result> {
    const commandValidated = this.validator.validate(command);

    if (!commandValidated.isValid) {
      return Err(
        new UseCaseCommandValidationExceptions(commandValidated.exceptions),
      );
    }

    const domainOptions = this.mapper.toDomain(command);

    const ${camel_case_dir_name}Result = await this.${camel_case_dir_name}Process.execute(
      domainOptions,
    );

    if (${camel_case_dir_name}Result.isErr()) {
      return Err(
        new UseCaseProcessExceptions(${camel_case_dir_name}Result.unwrapErr()),
      );
    }

    return Ok(this.mapper.toResponseDto(${camel_case_dir_name}Result.unwrap()));
  }
}
EOF

echo "Handler file created: $handler_file"
