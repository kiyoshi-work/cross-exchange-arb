import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CrossExArbiEntity } from '../entities/cross-ex-arbi.entity';

export class CrossExArbiRepository extends Repository<CrossExArbiEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(CrossExArbiEntity, dataSource.createEntityManager());
  }
}
