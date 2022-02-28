import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categories } from './interfaces/categories.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Categories>,
    private readonly playerService: PlayersService,
  ) {}

  async createCategory(
    createCategoriesDto: CreateCategoriesDto,
  ): Promise<Categories> {
    const { category } = createCategoriesDto;

    const foundCategory = await this.categoryModel.findOne({ category }).exec();

    if (foundCategory) {
      throw new BadRequestException(`Category ${category} already exists.`);
    }

    const createdCategory = new this.categoryModel(createCategoriesDto);
    return await createdCategory.save();
  }

  async getAllCategories(): Promise<Array<Categories>> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async getCategoryById(category: string): Promise<Categories> {
    const foundCategory = await this.categoryModel.findOne({ category }).exec();

    if (!foundCategory) {
      throw new NotFoundException(`The category ${category} was not found.`);
    }

    return foundCategory;
  }

  async getPlayerCategory(playerId: any): Promise<Categories> {
    const players = await this.playerService.getAllPlayers();

    const filter = players.filter((player) => player._id == playerId);

    if (filter.length == 0) {
      throw new BadRequestException(`The id ${playerId} is not a player`);
    }

    return await this.categoryModel
      .findOne()
      .where('players')
      .in(playerId)
      .exec();
  }

  async updateCategory(
    category: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const foundCategory = await this.categoryModel.findOne({ category }).exec();

    if (!foundCategory) {
      throw new NotFoundException(`The category ${category} was not found.`);
    }

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: updateCategoryDto })
      .exec();
  }

  async assignCategoryPlayer(params: string[]): Promise<void> {
    const category = params['category'];
    const player = params['playerId'];

    const foundCategory = await this.categoryModel.findOne({ category }).exec();
    const foundPlayer = await this.categoryModel
      .find({ category })
      .where('players')
      .in(player)
      .exec();

    await this.playerService.getPlayerById(player);

    if (!foundCategory) {
      throw new BadRequestException(`The category ${category} was not found.`);
    }

    if (foundPlayer.length > 0) {
      throw new BadRequestException(
        `Player with id ${player} already assigned in category ${category}`,
      );
    }

    foundCategory.players.push(player);
    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: foundCategory })
      .exec();
  }
}
