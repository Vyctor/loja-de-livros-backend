import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Country } from './address/entities/country.entity';
import { State } from './address/entities/state.entity';
import { Author } from './author/entities/author.entity';
import { Category } from './category/entities/category.entity';
import { Book } from './book/entities/book.entity';
import { Coupon } from './coupon/entities/coupon.entity';

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

  async seedAuthors(): Promise<void> {
    const payload = [
      {
        name: 'Anya Petrova',
        email: 'anya.petrova@sci-fi.com',
        description:
          'Anya é uma escritora de ficção científica que explora temas como inteligência artificial e viagens no tempo.',
      },
      {
        name: 'Benjamin Carter',
        email: 'ben.carter@romance.com',
        description:
          'Benjamin é um romancista conhecido por suas histórias de amor apaixonadas e cheias de drama.',
      },
      {
        name: 'Evelyn Blackwood',
        email: 'evelyn.blackwood@horror.com',
        description:
          'Evelyn é uma autora de terror que cria histórias sombrias e perturbadoras que exploram os medos mais profundos do ser humano.',
      },
      {
        name: 'Kai Chen',
        email: 'kai.chen@fantasy.com',
        description:
          'Kai é um escritor de fantasia que constrói mundos mágicos e épicos, repletos de criaturas míticas e heróis lendários.',
      },
      {
        name: 'Zara Iqbal',
        email: 'zara.iqbal@nonfiction.com',
        description:
          'Zara é uma escritora de não-ficção que aborda temas como história, filosofia e sociologia.',
      },
      {
        name: 'Omar Ruiz',
        email: 'omar.ruiz@poetry.com',
        description:
          'Omar é um poeta conhecido por seus versos intensos e emocionais, que exploram temas como amor, perda e a condição humana.',
      },
      {
        name: 'Maya Singh',
        email: 'maya.singh@shortstories.com',
        description:
          'Maya é uma contista que cria histórias curtas e impactantes, muitas vezes com finais surpreendentes.',
      },
      {
        name: 'Leo Santos',
        email: 'leo.santos@childrensbooks.com',
        description:
          'Leo é um autor de livros infantis que cria histórias divertidas e educativas para crianças de todas as idades.',
      },
      {
        name: 'Olivia Davis',
        email: 'olivia.davis@biography.com',
        description:
          'Olivia é uma biógrafa que pesquisa e escreve sobre a vida de personalidades históricas e contemporâneas.',
      },
      {
        name: 'Noah Kim',
        email: 'noah.kim@essays.com',
        description:
          'Noah é um ensaísta que explora temas diversos, desde a cultura pop até a filosofia, através de análises profundas e perspicazes.',
      },
    ];

    await this.dataSource.transaction(async (manager) => {
      for (const author of payload) {
        const exists = await manager.findOne(Author, {
          where: { email: author.email },
        });

        if (!exists?.id) {
          await manager.save(
            manager.create(Author, {
              ...author,
            }),
          );
        }
      }
    });
  }

  async seedCategories(): Promise<void> {
    const categoriesPayloadd = [
      { name: 'Infanto Juvenil' },
      { name: 'Crônicas' },
      { name: 'Romance' },
      { name: 'Ficção Científica' },
      { name: 'Fantasia' },
      { name: 'Terror' },
      { name: 'Mistério' },
      { name: 'Aventura' },
      { name: 'Poesia' },
      { name: 'Biografia' },
      { name: 'História' },
      { name: 'Filosofia' },
      { name: 'Religião' },
      { name: 'Ciências Sociais' },
      { name: 'Arte' },
      { name: 'Gastronomia' },
      { name: 'Viagens' },
      { name: 'Autoajuda' },
      { name: 'Humor' },
      { name: 'Suspense' },
    ];

    await this.dataSource.transaction(async (manager) => {
      for (const category of categoriesPayloadd) {
        const exists = await manager.findOne(Category, {
          where: { name: category.name },
        });

        if (!exists?.id) {
          await manager.save(
            manager.create(Category, {
              ...category,
            }),
          );
        }
      }
    });
  }

  async seedBooks(): Promise<void> {
    const booksPayload = [
      {
        title: 'Livro 1',
        synopsis: 'vvguimaraes@gmailcom.com',
        summary: 'Vyctor is a writer and a poet.',
        price: 20.0,
        pages: 150,
        isbn: '978-4-16-148410-1',
        releaseDate: '2024-12-12',
        categoryId: 1,
        authorId: 1,
      },
      {
        title: 'Livro 2',
        synopsis: 'vvguimaraes@gmailcom.com',
        summary: 'Vyctor is a writer and a poet.',
        price: 20.0,
        pages: 150,
        isbn: '978-4-16-148410-2',
        releaseDate: '2024-12-12',
        categoryId: 1,
        authorId: 1,
      },
    ];

    await this.dataSource.transaction(async (manager) => {
      for (const book of booksPayload) {
        const exists = await manager.findOne(Book, {
          where: { isbn: book.isbn },
        });

        if (!exists?.id) {
          await manager.save(
            manager.create(Book, {
              ...book,
            }),
          );
        }
      }
    });
  }

  async seedCoupons(): Promise<void> {
    const couponsPayload = [
      {
        code: 'BLACKFRIDAY2024',
        discountPercentage: 30,
        expireDate: '2024-11-30',
      },
      {
        code: 'CYBERMONDAY2024',
        discountPercentage: 25,
        expireDate: '2024-12-03',
      },
      {
        code: 'BLACKFRIDAY2024',
        discountPercentage: 20,
        expireDate: '2024-11-30',
      },
      {
        code: 'CYBERMONDAY2024',
        discountPercentage: 15,
        expireDate: '2024-12-03',
      },
      {
        code: 'CYBERMONDAY2024',
        discountPercentage: 15,
        expireDate: '2024-12-03',
        deletedAt: new Date(),
      },
    ];

    await this.dataSource.transaction(async (manager) => {
      for (const coupon of couponsPayload) {
        const exists = await manager.findOne(Coupon, {
          where: { code: coupon.code },
        });

        if (!exists?.id) {
          await manager.save(
            manager.create(Coupon, {
              ...coupon,
            }),
          );
        }
      }
    });
  }
}
