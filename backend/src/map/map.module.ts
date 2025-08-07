import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import {MapFactory} from "@/map/factory/map.factory";
import { MapController } from './map.controller';

@Module({
  providers: [MapService, MapFactory],
  exports: [MapService],
  controllers: [MapController],
})
export class MapModule {}