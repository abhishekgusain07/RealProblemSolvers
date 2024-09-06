'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

//todo : usecreateuserinfo endpoint 
// import { useCreateWorkSpace } from "../api/use-create-workspace";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateUserInfoModal } from "../store/create-userinfo-module";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { userProffesion } from "@/lib/types";
import Image from "next/image";
import { useCheckUserNameAvailability } from "../api/use-checkUserNameAvailaibility";


export const CreateUserInfoModal = () => {
    const router = useRouter();
    const [open, setOpen] = useCreateUserInfoModal();
    
    const [userName, setUserName] = useState<string>("");
    const [github, setGithub] = useState<string>("");
    const [linkedin, setLinkedin] = useState<string>("");
    const [lastProject, setLastProject] = useState<string>("");
    const [currentWork, setCurrentWork] = useState<string>("");
    const [profession, setProfession] = useState<string>("");
    const [institution, setInstitution] = useState<string>("");
    const [skills, setSkills] = useState<string[]>([]);
    const [profilePicture, setProfilePicture] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {isAvailable, isLoading, setUserName: setDebouncedUserName} = useCheckUserNameAvailability();

    //todo:
    // const {mutate, isPending } = useCreateWorkSpace();

    const handleClose = () => {
        setOpen(false);
        setUserName("");
    }

    //todo: process the skills array to a individual skills string
    // const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     mutate({
    //         name
    //     }, {
    //         onSuccess: (id) => {
    //             toast.success("Workspace created");
    //             router.push(`/workspace/${id}`);
    //             handleClose();
    //         }
    //     });
    // }
    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUserName = e.target.value;
        setUserName(newUserName);
        setDebouncedUserName(newUserName);
    }
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfilePicture(imageUrl);
        }
    };
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Fill in your information</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={() => {}}>
                <div className="flex flex-col justify-center items-center">
                        <div className="rounded-full overflow-hidden cursor-pointer" onClick={handleImageClick}
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
                            <Image
                                src={profilePicture || '/user.jpg'}
                                alt="Profile Picture"
                                width={100}
                                height={100}
                                className="rounded-full size-20"
                            />
                        </div>
                    </div>
                    <Input 
                        placeholder="UserName"
                        value={userName}
                        onChange={handleUserNameChange}
                        required
                        autoFocus
                        minLength={3}
                        disabled={false}
                    />
                    {isLoading ? (
                    <p className="text-sm text-muted-foreground">Checking...</p>
                    ) : isAvailable ? (
                        <p className="text-sm text-green-500">Username is available!</p>
                    ) : (
                        <p className="text-sm text-red-500">Username is not available.</p>
                    )}
                    <Input 
                        placeholder="github"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        required
                        autoFocus
                        minLength={3}
                        disabled={false}
                    />
                    <Input 
                        placeholder="linkedin"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        required
                        autoFocus
                        minLength={3}
                        disabled={false}
                    />
                    <Input 
                        placeholder="Tell use about your last project"
                        value={lastProject}
                        onChange={(e) => setLastProject(e.target.value)}
                        required
                        autoFocus
                        minLength={3}
                        disabled={false}
                    />
                    <Input 
                        placeholder="Tell use about your current work"
                        value={currentWork}
                        onChange={(e) => setCurrentWork(e.target.value)}
                        required
                        autoFocus
                        minLength={3}
                        disabled={false}
                    />
                    <Select
                        value={profession}
                        onValueChange={(value) => setProfession(value as userProffesion)}
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
                    <Input 
                        placeholder={profession === "student" ? "College/School Name" : "Company Name" }
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        required
                        autoFocus
                        minLength={3}
                        disabled={false}
                    />
                    <Input 
                        placeholder="Skills"
                        value={skills}
                        onChange={(e) => setSkills([...skills, e.target.value])}
                        required
                        autoFocus
                        minLength={3}
                        disabled={false}
                    />
                    <div className="flex justify-end">
                        <Button className="w-full" disabled={false}>
                            Create Workspace
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
