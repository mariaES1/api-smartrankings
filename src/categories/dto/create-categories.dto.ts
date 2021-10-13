import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";
import { Event } from "../interfaces/categories.interface";


export class CreateCategoriesDto{
    @IsString()
    @IsNotEmpty()
    readonly categorie: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @ArrayMinSize(1)
    events: Array<Event>;
}