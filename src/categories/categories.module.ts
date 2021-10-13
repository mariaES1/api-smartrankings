import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesSchema } from './interfaces/categories.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Categorie', schema: CategoriesSchema}])],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule {}
