import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { MessagingModule } from './messaging/messaging.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ProductsModule, InventoryModule, MessagingModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
