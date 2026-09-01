import 'reflect-metadata'

const SERVICE_METADATA_KEY = 'custom:service_name'

function Service(name: string): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(SERVICE_METADATA_KEY, name, target);
  }
}

@Service('DatabaseEngine')
class DatabaseService { }

@Service('UserRegistry')
class UserService {
  constructor(private db: DatabaseService) {}
}


@Service('SecurityGuard')
class AuthService{
  constructor(private userSvc: UserService) {}
}  

function bootstrap(targets: any[]) {
  targets.forEach((target) => {
    const serviceName = Reflect.getMetadata(SERVICE_METADATA_KEY, target);
    const dependencies = Reflect.getMetadata('design:paramtypes', target) || [];

    console.log(dependencies)


    console.log(`Scanning Service: ${target.name}`);
    console.log(`Metadata Alias: ${serviceName}`);
    console.log(`Dependencies: ${dependencies.map((d: any) => d.name).join(', ') || 'None'}`)
    console.log('\n');
  })
}

bootstrap([DatabaseService, UserService, AuthService]);