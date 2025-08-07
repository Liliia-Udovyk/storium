import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { FilesService } from './files.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from 'src/services/typeorm/entities/file.entity';
import { User } from 'src/services/typeorm/entities/user.entity';
import { CustomStorage } from 'src/services/storage';

@ApiTags('files')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: new CustomStorage(path.join(process.cwd(), 'uploads')),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiBody({
    description: 'Upload file with optional folderId',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folderId: { type: 'number', example: 1 },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File successfully uploaded',
    type: File,
  })
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileDto,
    @Req() req: Request & { user: User },
  ) {
    return this.filesService.create(file, body.folderId ?? null, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all files of the current user' })
  @ApiResponse({ status: 200, description: 'List of files', type: [File] })
  findAll(
    @Req() req: Request & { user: User },
    @Query('folder') folderId?: string,
  ) {
    return this.filesService.findAll(req.user, folderId ?? null);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by id' })
  @ApiResponse({ status: 200, description: 'File data', type: File })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ) {
    return this.filesService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update file by id' })
  @ApiResponse({ status: 200, description: 'Updated file data', type: File })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFileDto: UpdateFileDto,
    @Req() req: Request & { user: User },
  ) {
    return this.filesService.update(id, updateFileDto, req.user);
  }

  @ApiOperation({ summary: 'Search files by name' })
  @ApiResponse({ status: 200, description: 'Found files', type: [File] })
  search(@Query('name') name: string, @Req() req: Request & { user: User }) {
    return this.filesService.searchByName(name, req.user);
  }

  @Post(':id/clone')
  @ApiOperation({ summary: 'Clone a file by id' })
  @ApiResponse({ status: 201, description: 'Cloned file', type: File })
  clone(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ) {
    return this.filesService.clone(id, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file by id' })
  @ApiResponse({ status: 204, description: 'File deleted' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ) {
    return this.filesService.remove(id, req.user);
  }
}
