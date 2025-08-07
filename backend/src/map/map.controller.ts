import {Controller, Get} from '@nestjs/common';
import {MapService} from "@/map/map.service";

@Controller('maps')
export class MapController {

    constructor(private readonly mapService: MapService) {}

    @Get()
    get() {
        return this.mapService.getMapList()
    }

    @Get('/available')
    getAvailable() {
        return this.mapService.getMapList()
    }

}
