// Arquivo responsável pelo formato dos dados
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments') // indica que o model vai ser armazenado dentro da tabela 'appointments'
class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider_id: string;

    @ManyToOne(() => User) // muitos agendamentos para um único usuário
    @JoinColumn({ name: 'provider_id' }) // qual a coluna que vai identicar o prestador desse agendamento
    provider: User;

    @Column('timestamp with time zone')
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Appointment;
