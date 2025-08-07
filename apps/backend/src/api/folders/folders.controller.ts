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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FolderBreadcrumbDto } from './dto/folder-breadcrumb.dto';
import { Folder } from 'src/services/typeorm/entities/folder.entity';
import { User } from 'src/services/typeorm/entities/user.entity';

@ApiTags('folders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new folder' })
  @ApiResponse({ status: 201, description: 'Folder created', type: Folder })
  create(
    @Body() createFolderDto: CreateFolderDto,
    @Req() req: Request & { user: User },
  ) {
    return this.foldersService.create(createFolderDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all folders of the current user' })
  @ApiResponse({ status: 200, description: 'List of folders', type: [Folder] })
  findAll(@Req() req: Request & { user: User }) {
    return this.foldersService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get folder by id' })
  @ApiResponse({ status: 200, description: 'Folder data', type: Folder })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ) {
    return this.foldersService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update folder by id' })
  @ApiResponse({
    status: 200,
    description: 'Updated folder data',
    type: Folder,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFolderDto: UpdateFolderDto,
    @Req() req: Request & { user: User },
  ) {
    return this.foldersService.update(id, updateFolderDto, req.user);
  }

  @Get('/actions/search')
  @ApiOperation({ summary: 'Search folders by name' })
  @ApiResponse({ status: 200, description: 'Found folders', type: [Folder] })
  search(@Query('name') name: string, @Req() req: Request & { user: User }) {
    return this.foldersService.searchByName(name, req.user);
  }

  @Post(':id/clone')
  @ApiOperation({ summary: 'Clone a folder by id' })
  @ApiResponse({ status: 201, description: 'Cloned folder', type: Folder })
  clone(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ) {
    return this.foldersService.clone(id, req.user);
  }

  @Get(':id/breadcrumb')
  @ApiOperation({ summary: 'Get breadcrumb for folder by id' })
  @ApiResponse({
    status: 200,
    description: 'Breadcrumb path',
    type: [FolderBreadcrumbDto],
  })
  getBreadcrumb(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ) {
    return this.foldersService.getBreadcrumb(id, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete folder by id' })
  @ApiResponse({ status: 204, description: 'Folder deleted' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ) {
    return this.foldersService.remove(id, req.user);
  }
}
