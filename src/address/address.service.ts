import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCountryDto } from './dtos/create-country.dto';
import { CreateStateDto } from './dtos/create-state.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';
import { PaginateQuery, paginate } from 'nestjs-paginate';

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
  ) {}

  async createCountry(createCountryDto: CreateCountryDto) {
    const alreadyExists = await this.countryRepository.findOne({
      where: {
        name: createCountryDto.name,
      },
    });

    if (alreadyExists) {
      throw new ForbiddenException(
        `Já existe um país com o nome ${createCountryDto.name} cadastrado no sistema.`,
      );
    }

    const country = this.countryRepository.create(createCountryDto);
    return this.countryRepository.save(country);
  }

  async createState(createStateDto: CreateStateDto) {
    const country = await this.countryRepository.findOne({
      where: {
        id: createStateDto.countryId,
      },
    });
    if (!country) throw new ForbiddenException('País não encontrado.');

    const alreadyExists = await this.stateRepository.findOne({
      where: {
        name: createStateDto.name,
      },
      relations: ['country'],
      select: ['country'],
    });

    if (alreadyExists) {
      throw new ForbiddenException(
        `Já existe um estado com o nome ${createStateDto.name} cadastrado no país ${alreadyExists?.country?.name} de id ${createStateDto?.countryId}.`,
      );
    }

    const state = this.stateRepository.create({
      ...createStateDto,
      country,
    });
    return this.stateRepository.save(state);
  }

  async findAllCountries(query: PaginateQuery) {
    const result = await paginate(query, this.countryRepository, {
      sortableColumns: ['name'],
      defaultLimit: 10,
      maxLimit: 50,
      searchableColumns: ['name'],
    });

    if (result.data.length === 0) {
      this.logger.warn('Nenhum país encontrado.');
      throw new NotFoundException('Nenhum país encontrado.');
    }
    return result;
  }

  async findStatesByCountryId(countryId: number, query: PaginateQuery) {
    const result = await paginate(query, this.stateRepository, {
      sortableColumns: ['name'],
      defaultLimit: 10,
      maxLimit: 50,
      searchableColumns: ['name'],
    });

    if (result?.data?.length === 0) {
      this.logger.warn('Nenhum estado encontrado.');
      throw new NotFoundException('Nenhum estado encontrado.');
    }
    return result;
  }
}
