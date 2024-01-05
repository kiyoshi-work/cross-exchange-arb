import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserEntity } from '@/database/entities';

export class UserRepository extends Repository<UserEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }
}
