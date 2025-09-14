import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CURRENT_TIMESTAMP } from "../utils/constants";
import { Product } from "src/products/product.entity";
import { Review } from "src/review/review.entity";
import { UserType } from "src/utils/enums";
import { Exclude } from "class-transformer";

@Entity({name:"users"})
export class User {
    @PrimaryGeneratedColumn()
    id :number
    @Column({type:"varchar",length:"150",nullable:true})
    username :string
    @Column({type:"varchar",length:"250",unique:true})    
    email :string
    @Column()  
    @Exclude()  
    password :string
    @Column({type:"enum",enum:UserType,default:UserType.NORMAL_USER})    
    usertype :UserType
    @Column({default:false})    
    isAccountVerified :boolean
    @Column({ type :"varchar", nullable:true})    
    verificationToken :string | null
    @CreateDateColumn({type: "timestamp",default:()=> CURRENT_TIMESTAMP })
    createdAt :Date
    @UpdateDateColumn({type:"timestamp",default:()=> CURRENT_TIMESTAMP ,onUpdate:CURRENT_TIMESTAMP })
    updatedAt :Date
    @Column({ type :"varchar", nullable :true, default: null})
    profileImage:string | null
    @OneToMany(() => Product, (product) => product.user)
    products:Product[]
    @OneToMany(() => Review, (review) => review.user)
    reviews:Review[]

}