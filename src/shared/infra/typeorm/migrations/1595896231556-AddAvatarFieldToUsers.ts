import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export default class AddAvatarFieldToUsers1595896231556 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users',new TableColumn({
            name: 'avatar',
            type: 'varchar', // salva apenas o caminho da imagem no banco, aimagem pode ficar hospedada em algum CDN (Content Delivery Network - Amazon S3, Google Cloud Storage, etc)
            isNullable: true,
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'avatar');
    }

}
