import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categories } from './interfaces/categories.interface';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel('Categorie') private readonly categoryModel: Model<Categories>,
    private readonly playerService: PlayersService ) {}

    async createCategory(createCategoriesDto: CreateCategoriesDto): Promise<Categories>{
        const { category } = createCategoriesDto;

        const findedCategory = await this.categoryModel.findOne({category}).exec();

        if(findedCategory){
            throw new BadRequestException(`Categorie ${category} already exists.`);
        }

        const createdCategory = new this.categoryModel(createCategoriesDto);
        return await createdCategory.save();
    }

    async getAllCategories(): Promise<Array<Categories>>{
        return await this.categoryModel.find().populate("players").exec();
    }

    async getCategoryById(category: string): Promise<Categories>{
        const findedCategory = await this.categoryModel.findOne({category}).exec();

        if(!findedCategory){
            throw new NotFoundException(`The categorie ${category} was not found.`);
        }

        return findedCategory;
    }

    async updateCategory(category: string, updateCategoryDto: UpdateCategoryDto): Promise<void>{
        const findedCategory = await this.categoryModel.findOne({category}).exec();

        if(!findedCategory){
            throw new NotFoundException(`The categorie ${category} was not found.`);
        }

        await this.categoryModel.findOneAndUpdate({category},{$set: updateCategoryDto}).exec();
    }

    async assignCategoryPlayer(params: string[]): Promise<void>{
        const category = params['category'];
        const player = params['playerId'];

        const findedCategory = await this.categoryModel.findOne({category}).exec();
        const findedPlayer = await this.categoryModel.find({category}).where('players').in(player).exec();

        await this.playerService.getPlayerById(player);

        if(!findedCategory){
            throw new BadRequestException(`The categorie ${category} was not found.`);
        }

        if(findedPlayer.length > 0){
            throw new BadRequestException(`Player with id ${player} already assigned in category ${category}`);
        }

        findedCategory.players.push(player);
        await this.categoryModel.findOneAndUpdate({category},{$set: findedCategory}).exec();
    }
}
