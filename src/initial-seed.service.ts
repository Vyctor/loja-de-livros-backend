import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Country } from './address/entities/country.entity';
import { State } from './address/entities/state.entity';

@Injectable()
export class InitialSeedService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async seedCountriesAndStates(): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      let brasil = await manager.findOne(Country, {
        where: { name: 'Brasil' },
      });

      if (!brasil) {
        brasil = await manager.save(
          manager.create(Country, {
            name: 'Brasil',
          }),
        );
      }

      const statesData = [
        { name: 'Acre', abbreviation: 'AC' },
        { name: 'Alagoas', abbreviation: 'AL' },
        { name: 'Amapá', abbreviation: 'AP' },
        { name: 'Amazonas', abbreviation: 'AM' },
        { name: 'Bahia', abbreviation: 'BA' },
        { name: 'Ceará', abbreviation: 'CE' },
        { name: 'Distrito Federal', abbreviation: 'DF' },
        { name: 'Espírito Santo', abbreviation: 'ES' },
        { name: 'Goiás', abbreviation: 'GO' },
        { name: 'Maranhão', abbreviation: 'MA' },
        { name: 'Mato Grosso', abbreviation: 'MT' },
        { name: 'Mato Grosso do Sul', abbreviation: 'MS' },
        { name: 'Minas Gerais', abbreviation: 'MG' },
        { name: 'Pará', abbreviation: 'PA' },
        { name: 'Paraíba', abbreviation: 'PB' },
        { name: 'Paraná', abbreviation: 'PR' },
        { name: 'Pernambuco', abbreviation: 'PE' },
        { name: 'Piauí', abbreviation: 'PI' },
        { name: 'Rio de Janeiro', abbreviation: 'RJ' },
        { name: 'Rio Grande do Norte', abbreviation: 'RN' },
        { name: 'Rio Grande do Sul', abbreviation: 'RS' },
        { name: 'Rondônia', abbreviation: 'RO' },
        { name: 'Roraima', abbreviation: 'RR' },
        { name: 'Santa Catarina', abbreviation: 'SC' },
        { name: 'São Paulo', abbreviation: 'SP' },
        { name: 'Sergipe', abbreviation: 'SE' },
        { name: 'Tocantins', abbreviation: 'TO' },
      ];

      for (const state of statesData) {
        const exists = await manager.findOne(State, {
          where: {
            name: state.name,
            country: {
              id: brasil.id,
            },
          },
        });

        if (!exists?.id) {
          await manager.save(
            manager.create(State, {
              name: state.name,
              country: brasil,
            }),
          );
        }
      }
    });

    console.log('Countries seeded');
  }
}
