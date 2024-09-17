import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('coupon')
@ApiTags('Coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Coupon created successfully' })
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all coupons' })
  findAll(@Paginate() query: PaginateQuery) {
    return this.couponService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return a coupon' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(+id);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Coupon deleted successfully' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.couponService.remove(+id);
  }
}
