import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categories } from './interfaces/categories.interface'

@Controller('api/v1/categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createCategorie(@Body() createCategoriesDto: CreateCategoriesDto): Promise<Categories> {
        return this.categoriesService.createCategory(createCategoriesDto);
    }

    @Get()
    async getCategories(): Promise<Array<Categories>>{
        return this.categoriesService.getAllCategories();
    }

    @Get('/:category')
    async getById(@Param('category') category: string): Promise<Categories>{
        return this.categoriesService.getCategoryById(category);
    }

    @Put('/:category')
    @UsePipes(ValidationPipe)
    async updateCategorie(@Body() updateCategoryDto: UpdateCategoryDto, @Param('category') category: string): Promise<void>{
        this.categoriesService.updateCategory(category, updateCategoryDto);
    }

    @Post('/:category/players/:playerId')
    async assignPlayer(@Param() params: string[]): Promise<void>{
        return this.categoriesService.assignCategoryPlayer(params);
    }
}
