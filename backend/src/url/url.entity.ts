import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
/**
 * Entity representing a shortened URL and its mapping to the original URL.
 */
export class Url {
  @PrimaryGeneratedColumn()
  /**
   * Unique identifier for the URL entity.
   */
  id: number;

  @Column()
  /**
   * The original URL that was shortened.
   */
  originalUrl: string;

  @Column({ unique: true })
  /**
   * The unique short code for the shortened URL.
   */
  shortCode: string;

  @CreateDateColumn()
  /**
   * Timestamp when the URL entity was created.
   */
  createdAt: Date;
}
