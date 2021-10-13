import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { Categories } from './interfaces/categories.interface'

@Controller('api/v1/categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createCategorie(@Body() createCategoriesDto: CreateCategoriesDto): Promise<Categories> {
        return this.categoriesService.createCategorie(createCategoriesDto);
    }

    @Get()
    async getCategories(): Promise<Array<Categories>>{
        return this.categoriesService.getAllCategories();
    }

    @Get('/:categorie')
    async getById(@Param('categorie') categorie: string): Promise<Categories>{
        return this.categoriesService.getCategorieById(categorie);
    }
}
