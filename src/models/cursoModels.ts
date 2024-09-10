import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from "typeorm";
import { Profesor } from "./profesorModels";
import { Estudiante } from "./estudianteModels";

@Entity("cursos")
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column("text")
  descripcion: string;

  @ManyToOne(() => Profesor, (profesor) => profesor.cursos)
  @JoinColumn({ name: "profesor_id" })
  profesor: Profesor;

  @ManyToMany(() => Estudiante)
  @JoinTable({
    name: "cursos_estudiantes",
    joinColumn: {
      name: "curso_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "estudiante_id",
      referencedColumnName: "id",
    },
  })
  estudiantes: Estudiante[];
}
