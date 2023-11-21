import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokemonService } from 'src/pokemon/pokemon.service';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(private pokemonService: PokemonService) {}

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );

    const promises = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      return this.pokemonService.create({ name, no });
    });
    await Promise.all(promises);
    return 'Seed executed successfully!';
  }
}
