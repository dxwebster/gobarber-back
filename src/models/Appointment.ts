// Arquivo responsável pelo formato dos dados
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appointments') // indica que o model vai ser armazenado dentro da tabela 'appointments'
class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider: string;

    @Column('timestamp with time zone')
    date: Date;
}

export default Appointment;
