import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonsModule } from './common/common.module';
import { InstanceDomainModule } from './instance-domain.module';

@Module({
  imports: [
    CommonsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Record<string, string>, true>) => ({
        type: 'postgres' as const,
        url: config.getOrThrow<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    InstanceDomainModule,
  ],
})
export class AppModule {}
