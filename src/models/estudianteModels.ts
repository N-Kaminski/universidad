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
  // @JoinTable({
  //   name: "cursos_estudiantes",
  //   joinColumn: {
  //     name: "estudiante_id",
  //     referencedColumnName: "id",
  //   },
  //   inverseJoinColumn: {
  //     name: "curso_id",
  //     referencedColumnName: "id",
  //   },
  // })
  cursos: Curso[];
}
