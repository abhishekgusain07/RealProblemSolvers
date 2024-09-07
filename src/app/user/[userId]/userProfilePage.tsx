'use client'

import { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { userProffesion } from '@/lib/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MagicCard } from '@/components/magicui/magic-card'
import { Separator } from '@/components/ui/separator'

type UserInfo = {
  userId: string
  userName: string
  github: string
  linkedin?: string
  lastProject?: string
  currentWork?: string
  profession: userProffesion
  institution?: string
  skills: string[]
  averageRating: number
  totalRatings: number
  projectsCompleted: number
  photoId?: string
}

export default function VibrantUserProfile({ initialUserInfo }: { initialUserInfo: UserInfo }) {
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo)
  const [isEditing, setIsEditing] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [isChanged, setIsChanged] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(userInfo.photoId ? userInfo.photoId : null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
    if(userInfo === initialUserInfo){
      setIsChanged(false)
    }else{
      setIsChanged(true)
    }
  }

  const handleProfessionChange = (value: "student" | "workingProfessional") => {
    setUserInfo({ ...userInfo, profession: value })
  }

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setImage(file);
          const imageUrl = URL.createObjectURL(file);
          setProfilePicture(imageUrl);
      }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated userInfo to your backend
    console.log('Updated user info:', userInfo)
    setIsEditing(false)
  }

  return (
    <div className="w-screen h-screen flex flex-col">
        <div className='w-full flex justify-center items-center h-[10vh] mt-7'>
            <h1 className='text-xl font-bold text-muted-foreground'>Profile/ongoing projects</h1>
        </div>
        <div className='h-full w-full m-5 rounded-lg py-10'>
        <div className='flex flex-col md:flex-row'>
            <div className='w-[30vw] mb-auto p-8 text-center bg-white'>
                <div className='pt-4 px-3 flex flex-col justify-center relative mb-auto'
                onClick={handleImageClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                      handleImageClick();
                  }
                  }}
                >
                    <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-black shadow-lg"
                    >
                          
                        <AvatarImage src={profilePicture || '/user.jpg'} alt={userInfo.userName} className='object-cover' />
                        <AvatarFallback className="text-3xl font-bold">
                          <img src={'/user.jpg'} alt={userInfo.userName} className='object-contain' />
                        </AvatarFallback>
                    </Avatar>
                    <div className='mt-3 flex flex-col gap-y-3'>
                      <div
                        className='flex flex-col md:flex-row justify-between items-center gap-x-3 bg-white rounded-lg shadow-xl cursor-pointer px-3 py-9'
                      >
                        <p className='text-xl font-bold '>Average Rating</p>
                        <p className='text-xl font-bold text-muted-foreground'>{userInfo.averageRating}</p>
                      </div>
                      <div
                        className='flex flex-col md:flex-row justify-between items-center gap-x-3 bg-white rounded-lg shadow-xl cursor-pointer px-3 py-9'
                      >
                        <p className='text-xl font-bold '>Total Ratings</p>
                        <p className='text-xl font-bold text-muted-foreground'>{userInfo.totalRatings}</p>
                      </div>
                      <div
                        className='flex flex-col md:flex-row justify-between items-center gap-x-3 bg-white rounded-lg shadow-xl cursor-pointer px-3 py-9'
                      >
                        <p className='text-xl font-bold '>Projects Completed</p>
                        <p className='text-xl font-bold text-muted-foreground'>{userInfo.projectsCompleted}</p>
                      </div>
                    </div>
                    <Button className='w-full mt-5'
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isChanged}
                    >Save Profile</Button>
                </div>
            </div>
            <div className="bg-white bg-opacity-30 p-8 text-center w-[69vw]">
                <div className='mt-5 flex flex-col gap-y-6 items-center justify-center mx-auto w-[80%]'>
                    <Input type="text" name="userName" value={userInfo.userName} onChange={handleInputChange} placeholder="Enter your name" label="userName" />
                    <Input type="text" name="github" value={userInfo.github} onChange={handleInputChange} placeholder="Enter your github" label="github"/>
                    <Input type="text" name="linkedin" value={userInfo.linkedin} onChange={handleInputChange} placeholder="Enter your linkedin" label="linkedin"/>
                    <Input type="text" name="lastProject" value={userInfo.lastProject} onChange={handleInputChange} placeholder="Enter your last project" label="lastProject"/>
                    <Input type="text" name="currentWork" value={userInfo.currentWork} onChange={handleInputChange} placeholder="Enter your current work" label="currentWork"/>
                    <Input type="text" name="institution" value={userInfo.institution} onChange={handleInputChange} placeholder="Enter your institution" label="institution"/>
                    <Select
                        value={userInfo.profession}
                        onValueChange={(value) => handleProfessionChange(value as userProffesion)}
                        required
                        disabled={false}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select your profession" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="workingProfessional">Working Professional</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input type="text" name="skills" value={userInfo.skills} onChange={handleInputChange} placeholder="Enter your skills" label="skills"/>
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}