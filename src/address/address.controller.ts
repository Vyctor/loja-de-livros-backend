import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateCountryDto } from './dtos/create-country.dto';
import { CreateStateDto } from './dtos/create-state.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';

@Controller('address')
@ApiTags('Address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiResponse({
    status: 201,
    description: 'Country created successfully',
    type: Country,
  })
  @Post('country')
  @HttpCode(201)
  async createCountry(
    @Body() createCountryDto: CreateCountryDto,
  ): Promise<Country> {
    return this.addressService.createCountry(createCountryDto);
  }

  @ApiResponse({
    status: 201,
    description: 'State created successfully',
    type: State,
  })
  @Post('state')
  @HttpCode(201)
  async createState(@Body() createStateDto: CreateStateDto): Promise<State> {
    return this.addressService.createState(createStateDto);
  }

  @ApiResponse({ status: 200, description: 'Return all countries' })
  @Get('country')
  async findAllCountries(@Paginate() query: PaginateQuery) {
    return this.addressService.findAllCountries(query);
  }

  @ApiResponse({ status: 200, description: 'Return all states' })
  @Get('country/:id/states')
  async findAllStatesByCountry(
    @Param('id', new ParseIntPipe()) id: number,
    @Paginate() query: PaginateQuery,
  ) {
    return this.addressService.findStatesByCountryId(id, query);
  }
}
