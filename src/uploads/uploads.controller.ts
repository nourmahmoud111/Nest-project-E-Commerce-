import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Express, Response } from 'express';

@Controller('api/uploads')
export class UploadsController {



    @Post()
    @UseInterceptors(FileInterceptor('file'))
    public uploadFile(@UploadedFile() file:Express.Multer.File) {
        if(!file) throw new BadRequestException('no file provided')
    return {message :'file uploaded successfully'}
    

}



    @Post('multiple-files')
    @UseInterceptors(FilesInterceptor('files'))
    public uploadMultipleFiles(@UploadedFiles() files:Array<Express.Multer.File>) {
        if(!files || files.length === 0) throw new BadRequestException('no file provided')
    return {message :'files uploaded successfully'}
    
}




@Get(":image")
public showUploadedImage(@Param('image') image:string,@Res() res:Response){
    return res.sendFile(image,{root:'images'})
}

}