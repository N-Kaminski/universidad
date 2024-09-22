import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { Curso } from "./cursoModels";

@Entity("estudiantes")
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dni: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Curso, (curso) => curso.estudiantes)
  cursos: Curso[];
}
