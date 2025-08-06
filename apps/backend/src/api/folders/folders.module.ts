import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FoldersService } from './folders.service';
import { FilesModule } from '../files/files.module';
import { FoldersController } from './folders.controller';
import { Folder } from 'src/services/typeorm/entities/folder.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder, File]),
    forwardRef(() => FilesModule),
  ],
  providers: [FoldersService],
  controllers: [FoldersController],
  exports: [FoldersService],
})
export class FoldersModule {}
