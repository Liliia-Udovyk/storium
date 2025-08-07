import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Repository } from 'typeorm';

import { Folder } from 'src/services/typeorm/entities/folder.entity';
import { User } from 'src/services/typeorm/entities/user.entity';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FolderBreadcrumbDto } from './dto/folder-breadcrumb.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,

    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService,
  ) {}

  async create(dto: CreateFolderDto, owner: User): Promise<Folder> {
    const folder = this.folderRepository.create({ name: dto.name, owner });

    if (dto.parentId) {
      const parent = await this.folderRepository.findOne({
        where: { id: dto.parentId, owner },
      });
      if (!parent) throw new NotFoundException('Parent folder not found');
      folder.parent = parent;
    }

    return this.folderRepository.save(folder);
  }

  async findAll(owner: User): Promise<Folder[]> {
    return this.folderRepository.find({
      where: {
        owner,
        parent: IsNull(),
      },
      relations: ['folders', 'files'],
    });
  }

  async findOne(id: number, owner: User): Promise<Folder> {
    const folder = await this.folderRepository.findOne({
      where: { id, owner },
      relations: ['folders', 'files'],
    });

    if (!folder) throw new NotFoundException('Folder not found');
    return folder;
  }

  async searchByName(name: string, owner: User): Promise<Folder[]> {
    return this.folderRepository.find({
      where: {
        owner,
        name: ILike(`%${name}%`),
      },
      relations: ['parent', 'folders', 'files'],
    });
  }

  async update(id: number, dto: UpdateFolderDto, owner: User): Promise<Folder> {
    const folder = await this.findOne(id, owner);

    if (dto.name !== undefined) {
      folder.name = dto.name;
    }

    if (dto.parentId !== undefined) {
      if (dto.parentId === null) {
        folder.parent = null;
      } else {
        const parent = await this.folderRepository.findOne({
          where: { id: dto.parentId, owner },
        });
        if (!parent) throw new NotFoundException('New parent folder not found');
        folder.parent = parent;
      }
    }

    return this.folderRepository.save(folder);
  }

  async clone(id: number, owner: User, parent?: Folder): Promise<Folder> {
    const folder = await this.folderRepository.findOne({
      where: { id, owner },
      relations: ['parent', 'folders', 'files'],
    });

    if (!folder) throw new NotFoundException('Folder not found');

    const clonedFolder = this.folderRepository.create({
      name: folder.name + ' (copy)',
      owner,
      parent: parent || folder.parent || null,
    });
    const savedFolder = await this.folderRepository.save(clonedFolder);

    for (const childFolder of folder.folders || []) {
      await this.clone(childFolder.id, owner, savedFolder);
    }

    for (const file of folder.files || []) {
      await this.filesService.clone(file.id, owner, savedFolder);
    }

    return savedFolder;
  }

  async getBreadcrumb(id: number, owner: User): Promise<FolderBreadcrumbDto[]> {
    const folder = await this.folderRepository.findOne({
      where: { id, owner },
      relations: ['parent'],
    });
    if (!folder) throw new NotFoundException('Folder not found');

    const breadcrumb: FolderBreadcrumbDto[] = [];

    let current: Folder | null = folder;
    while (current) {
      breadcrumb.push({ id: current.id, name: current.name });
      current = current.parent || null;
    }

    return breadcrumb.reverse();
  }

  async remove(id: number, owner: User): Promise<void> {
    const folder = await this.folderRepository.findOne({
      where: { id, owner },
      relations: ['folders', 'files'],
    });
    if (!folder) throw new NotFoundException('Folder not found');

    for (const childFolder of folder.folders || []) {
      await this.remove(childFolder.id, owner);
    }

    for (const file of folder.files || []) {
      await this.filesService.remove(file.id, owner);
    }

    await this.folderRepository.remove(folder);
  }
}
