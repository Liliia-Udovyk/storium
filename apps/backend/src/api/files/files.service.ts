import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

import { UpdateFileDto } from './dto/update-file.dto';
import { Folder } from 'src/services/typeorm/entities/folder.entity';
import { User } from 'src/services/typeorm/entities/user.entity';
import { File } from 'src/services/typeorm/entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,

    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
  ) {}

  async create(
    file: Express.Multer.File,
    folderId: number | null,
    user: User,
  ): Promise<File> {
    return this.fileRepository.save({
      name: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
      folder: folderId ? { id: folderId } : null,
      owner: user,
    });
  }

  async findAll(owner: User, folderId: string | null): Promise<File[]> {
    const where: FindOptionsWhere<File> = { owner };

    if (folderId === 'null') {
      where.folder = IsNull();
    } else if (folderId !== null) {
      where.folder = { id: Number(folderId) };
    }

    return this.fileRepository.find({
      where,
      relations: ['folder'],
    });
  }

  async findOne(id: number, owner: User): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id, owner },
      relations: ['folder'],
    });
    if (!file) throw new NotFoundException('File not found');
    return file;
  }

  async searchByName(name: string, owner: User): Promise<File[]> {
    return this.fileRepository.find({
      where: {
        owner,
        name: ILike(`%${name}%`),
      },
      relations: ['folder'],
    });
  }

  async update(
    id: number,
    updateFileDto: UpdateFileDto,
    owner: User,
  ): Promise<File> {
    const file = await this.findOne(id, owner);

    if (updateFileDto.folderId !== undefined) {
      if (updateFileDto.folderId === null) {
        file.folder = null;
      } else {
        const folder = await this.folderRepository.findOne({
          where: { id: updateFileDto.folderId, owner },
        });
        if (!folder) throw new NotFoundException('Folder not found');
        file.folder = folder;
      }
    }

    if (updateFileDto.name !== undefined) {
      file.name = updateFileDto.name;
    }

    return this.fileRepository.save(file);
  }

  async clone(id: number, owner: User, targetFolder?: Folder): Promise<File> {
    const file = await this.findOne(id, owner);

    const uploadsDir = path.join(process.cwd(), 'uploads');
    const oldPath = path.join(uploadsDir, path.basename(file.url));
    const ext = path.extname(file.name);
    const newFilename = `${uuid()}${ext}`;
    const newPath = path.join(uploadsDir, newFilename);

    fs.copyFileSync(oldPath, newPath);

    const clonedFile = this.fileRepository.create({
      name: file.name + ' (copy)',
      mimeType: file.mimeType,
      size: file.size,
      url: `/uploads/${newFilename}`,
      owner,
      folder: targetFolder ?? file.folder ?? null,
    });

    return this.fileRepository.save(clonedFile);
  }

  async remove(id: number, owner: User): Promise<void> {
    const file = await this.findOne(id, owner);

    const filePath = path.join(process.cwd(), file.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.fileRepository.remove(file);
  }
}
