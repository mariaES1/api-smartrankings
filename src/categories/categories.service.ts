import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { Categories } from './interfaces/categories.interface';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel('Categorie') private readonly categorieModel: Model<Categories>) {}

    async createCategorie(createCategoriesDto: CreateCategoriesDto): Promise<Categories>{
        const { categorie } = createCategoriesDto;

        const findedCategorie = await this.categorieModel.findOne({categorie}).exec();

        if(findedCategorie){
            throw new BadRequestException(`Categorie ${categorie} already exists.`);
        }

        const createdCategorie = new this.categorieModel(createCategoriesDto);
        return await createdCategorie.save();
    }

    async getAllCategories(): Promise<Array<Categories>>{
        return await this.categorieModel.find().exec();
    }

    async getCategorieById(categorie: string): Promise<Categories>{
        const findedCategorie = await this.categorieModel.findOne({categorie}).exec();

        if(!findedCategorie){
            throw new NotFoundException(`The categorie ${categorie} was not found.`);
        }

        return findedCategorie;
    }
}
