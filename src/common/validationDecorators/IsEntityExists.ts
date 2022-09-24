import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { Base } from '../../entity/Base';
import { EntityTarget, getRepository } from 'typeorm';

export function IsEntityExists(
  entity: () => object,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsEntityExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [entity],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          console.log('ENTITY', args);
          const [func] = args.constraints;
          const entity = func();
          console.log(
            'entity',
            getRepository(entity as EntityTarget<Base>).findOne(
              args.object['id'],
            ),
          );
          return await !!getRepository(entity as EntityTarget<Base>).findOne(
            args.object['id'],
          );
          // const relatedValue = (args.object as any)[relatedPropertyName];
          // return typeof value === 'string' && typeof relatedValue === 'string' && value.length > relatedValue.length; // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
