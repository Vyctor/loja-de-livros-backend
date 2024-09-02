import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import * as dayjs from 'dayjs';

@Injectable()
export class CouponService {
  private readonly logger = new Logger(CouponService.name);

  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<void> {
    const validDate = dayjs(new Date()).isBefore(
      new Date(createCouponDto.expireDate),
    );

    if (!validDate) {
      throw new BadRequestException(
        'A data de expiração do cupom precisar maior que a data atual',
      );
    }

    const alreadyExists = await this.couponRepository.findOne({
      where: {
        code: createCouponDto.code,
      },
    });
    if (alreadyExists) {
      throw new BadRequestException('Já existe um cupom com esse código');
    }
    const coupon = this.couponRepository.create(createCouponDto);
    await this.couponRepository.save(coupon);
  }

  async findAll(query: PaginateQuery): Promise<Coupon[]> {
    const result = await paginate(query, this.couponRepository, {
      sortableColumns: ['code', 'discountPercentage', 'expireDate'],
      defaultLimit: 10,
      maxLimit: 50,
      searchableColumns: ['code', 'discountPercentage', 'expireDate'],
    });

    if (result.data.length === 0) {
      this.logger.warn('Nenhum cupom encontrado.');
      throw new NotFoundException('Nenhum cupom encontrado.');
    }
    return result.data;
  }

  async findOne(id: number): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: {
        id,
      },
    });

    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado');
    }

    return coupon;
  }

  async remove(id: number): Promise<void> {
    const coupon = await this.couponRepository.findOne({
      where: {
        id,
      },
    });

    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado');
    }

    coupon.deletedAt = new Date();
    await this.couponRepository.save(coupon);
  }
}
