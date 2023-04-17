#!/bin/bash

# Check if a use case name was provided
if [ -z "$1" ]; then
	echo "Please provide a use case name."
	exit 1
fi

# Set up variables
use_case_name="$1"
dir_name="$(echo "$use_case_name" | sed 's/\([A-Z]\)/-\1/g' | tr '[:upper:]' '[:lower:]' | sed 's/^-//')"

echo "Creating use case: $use_case_name"

base_path="./src/use-cases/${dir_name}"
app_services_path="${base_path}/application-services"
dtos_path="${base_path}/dtos"

# Create directories
mkdir -p "${app_services_path}"
mkdir -p "${dtos_path}"

# Create files
touch "${base_path}/application-services/index.ts"
touch "${base_path}/application-services/${dir_name}.mapper.ts"
touch "${base_path}/application-services/${dir_name}.process.ts"
touch "${base_path}/application-services/${dir_name}.validator.ts"

touch "${base_path}/dtos/index.ts"
touch "${base_path}/dtos/${dir_name}.command.ts"
touch "${base_path}/dtos/${dir_name}.domain-options.ts"
touch "${base_path}/dtos/${dir_name}.response.dto.ts"
touch "${base_path}/dtos/${dir_name}.result.ts"

touch "${base_path}/index.ts"
touch "${base_path}/${dir_name}.handler.ts"

cat >"${base_path}/index.ts" <<EOL
export * from './${dir_name}.handler';
EOL

cat >"${dtos_path}/index.ts" <<EOL
export * from './${dir_name}.result';
export * from './${dir_name}.command';
export * from './${dir_name}.response.dto';
export * from './${dir_name}.domain-options';
EOL

cat >"${app_services_path}/index.ts" <<EOL
export * from './${dir_name}.validator';
export * from './${dir_name}.mapper';
export * from './${dir_name}.process';
EOL

./scripts/create-handler.sh "${use_case_name}" "${base_path}"

cat >"${dtos_path}/${dir_name}.command.ts" <<EOL
import { ICommand } from '@nestjs/cqrs';

export class ${use_case_name}Command implements ICommand{ }
EOL

cat >"${dtos_path}/${dir_name}.response.dto.ts" <<EOL
export class ${use_case_name}ResponseDto { }
EOL

cat >"${dtos_path}/${dir_name}.result.ts" <<EOL
import { Result } from 'oxide.ts'

export type ${use_case_name}Result { }
EOL

cat >"${dtos_path}/${dir_name}.domain-options.ts" <<EOL
export type ${use_case_name}DomainOptions
EOL

cat >"${app_services_path}/${dir_name}.validator.ts" <<EOL
@Injectable()
export class ${use_case_name}Validator extends ValidatorBase{ }
EOL

cat >"${app_services_path}/${dir_name}.mapper.ts" <<EOL
@Injectable()
export class ${use_case_name}Mapper { }
EOL

cat >"${app_services_path}/${dir_name}.process.ts" <<EOL
export type ${use_case_name}ProcessSuccess = 
export type ${use_case_name}ProcessFailure = Array<>

@Injectable()
export class ${use_case_name}Process extends ProcessBase<${use_case_name}ProcessSuccess, ${use_case_name}ProcessFailure>{ }
EOL

echo "Use case '${use_case_name}' directory structure created."
