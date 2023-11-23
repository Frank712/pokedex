import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany();
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemonsToInsert = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      return { name, no };
    });
    await this.pokemonModel.insertMany(pokemonsToInsert);
    return 'Seed executed successfully!';
  }
}
