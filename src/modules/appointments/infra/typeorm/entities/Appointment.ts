// Arquivo responsável pelo formato dos dados
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments') // indica que o model vai ser armazenado dentro da tabela 'appointments'
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // coluna
  @Column()
  provider_id: string;

  // relacionamento do banco de dados
  @ManyToOne(() => User) // muitos agendamentos para um único usuário
  @JoinColumn({ name: 'provider_id' }) // qual a coluna que vai identicar o prestador desse agendamento
  provider: User;

  // coluna
  @Column()
  user_id: string;

  // relacionamento do banco de dados
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // coluna
  @Column('timestamp with time zone')
  date: Date;

  // coluna
  @CreateDateColumn()
  created_at: Date;

  // coluna
  @UpdateDateColumn()
  updated_at: Date;
}

export default Appointment;
