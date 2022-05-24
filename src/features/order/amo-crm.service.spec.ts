// import { config } from 'dotenv';
// config();
// import { Test, TestingModule } from '@nestjs/testing';
// import { AmoCrmService } from './amo-crm.service';
// import { MetaService } from '../meta/meta.service';
// import { MetaModule } from '../meta/meta.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Client } from '../../entity/Client';
// import { Order } from '../../entity/Order';
// import { Product } from '../../entity/Product';
// import { OrderProfile } from '../../entity/OrderProfile';
// import { OrderProduct } from '../../entity/OrderProduct';
// import { Meta } from '../../entity/Meta';
// import { NestApplication } from '@nestjs/core';
// import { OrderModule } from './order.module';
//
// describe('TesterService', () => {
//   let service: AmoCrmService;
//   let app: NestApplication;
//   let module: TestingModule;
//
//   beforeAll(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [TypeOrmModule.forFeature([Meta]), MetaModule],
//       providers: [AmoCrmService, MetaService],
//     }).compile();
//     module = await Test.createTestingModule({
//       imports: [
//         MetaModule,
//         // Use the e2e_test database to run the tests
//         TypeOrmModule.forRoot({
//           type: 'postgres',
//           database: process.env.DB_DATABASE,
//           host: process.env.DB_HOST,
//           port: +process.env.DB_PORT,
//           username: process.env.DB_USERNAME,
//           password: process.env.DB_PASSWORD,
//           synchronize: false,
//           entities: [Meta],
//         }),
//       ],
//     }).compile();
//     app = module.createNestApplication();
//     await app.init();
//   });
//
//   beforeEach(async () => {
//
//     service = module.get<AmoCrmService>(AmoCrmService);
//   });
//
//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
//
//   it('getAuthToken', async () => {
//     const token = await service.getAuthToken();
//     console.log('token', token);
//     expect(token).toBe(token);
//   });
//
//   it('getAllOrderStatuses', async () => {
//     const orderStatuses = await service.getAllOrderStatuses();
//     console.log('getAllOrderStatuses', orderStatuses);
//     expect(orderStatuses).toBe(orderStatuses);
//   });
// });
