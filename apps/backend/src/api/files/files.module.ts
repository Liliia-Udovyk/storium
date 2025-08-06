import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FoldersModule } from '../folders/folders.module';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from 'src/services/typeorm/entities/file.entity';
import { Folder } from 'src/services/typeorm/entities/folder.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([File, Folder]),
    forwardRef(() => FoldersModule),
  ],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
