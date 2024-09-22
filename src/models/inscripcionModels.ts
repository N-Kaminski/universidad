import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Curso } from "./cursoModels";
import { Estudiante } from "./estudianteModels";

@Entity("cursos_estudiantes")
export class Inscripcion {
  @PrimaryColumn()
  curso_id: number;

  @PrimaryColumn()
  estudiante_id: number;

  @Column({ type: "int", nullable: true })
  nota: number | null;

  @Column({ type: "date", default: () => `NOW()` })
  fecha: Date;

  @ManyToOne(() => Curso, (curso) => curso.estudiantes)
  @JoinColumn({ name: "curso_id" })
  curso: Curso;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.cursos)
  @JoinColumn({ name: "estudiante_id" })
  estudiante: Estudiante;
}
