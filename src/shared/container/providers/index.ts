import { container } from 'tsyringe';

// Registro de Providers para dependency injection
// Sempre que for implementar uma biblioteca externa é necessário utilizar esse dependency injection
// Pois é um serivço que pode mudar

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IStorageProvider>('StorageProvicer', DiskStorageProvider);

container.registerSingleton<IMailTemplateProvider>('MailTemplateProvider', HandlebarsMailTemplateProvider);

container.registerInstance<IMailProvider>('MailProvider', container.resolve(EtherealMailProvider));
