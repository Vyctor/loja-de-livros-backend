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

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('country')
  @HttpCode(201)
  async createCountry(@Body() createCountryDto: CreateCountryDto) {
    return this.addressService.createCountry(createCountryDto);
  }

  @Post('state')
  @HttpCode(201)
  async createState(@Body() createStateDto: CreateStateDto) {
    return this.addressService.createState(createStateDto);
  }

  @Get('country')
  async findAllCountries(@Paginate() query: PaginateQuery) {
    return this.addressService.findAllCountries(query);
  }

  @Get('country/:id/states')
  async findAllStatesByCountry(
    @Param('id', new ParseIntPipe()) id: number,
    @Paginate() query: PaginateQuery,
  ) {
    return this.addressService.findStatesByCountryId(id, query);
  }
}
