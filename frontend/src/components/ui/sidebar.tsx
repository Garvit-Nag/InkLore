"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import Image from "next/image";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { Github, Linkedin, Mail, Database } from 'lucide-react';


interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

const socialLinks: Links[] = [
  {
    label: "GitHub",
    href: "https://github.com/Garvit-Nag",
    icon: <Github className="text-neutral-200 w-6 h-6" />
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/garvit-nag/",
    icon: <Linkedin className="text-neutral-200 w-6 h-6" />
  },
  {
    label: "Email",
    href: "mailto:garvitcpp@gmail.com",
    icon: <Mail className="text-neutral-200 w-6 h-6" />
  },
  {
    label: "Kaggle",
    href: "https://www.kaggle.com/code/garvitcpp/notebookef69fc93c7",
    icon: <Database className="text-neutral-200 w-6 h-6" />
  },
  {
    label: "Garvit",
    href: "#",
    icon: (
      <div className="relative w-10 h-10">
        <Image
          src="/pfp.jpg"
          alt="Profile"
          fill
          className="object-cover rounded-full"
        />
      </div>
    )
  }
];

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

const Logo = () => {
  const { open } = useSidebar();
  
  return (
    <button 
      onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}`}
      className="h-16 relative flex items-center justify-center md:justify-start focus:outline-none"
    >
      <motion.div 
        className="relative h-[90%] ml-1"
        initial={false}
        animate={{
          width: open ? "180px" : "60px"
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={open ? "expanded" : "collapsed"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={open ? "/icon.png" : "/icon_collapsed.png"}
              alt="Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </button>
  );
};

const SidebarContent = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start mb-10">
        <Logo />
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div className="space-y-2">
          {socialLinks.slice(0, -1).map((link) => (
            <SidebarLink key={link.label} link={link} />
          ))}
        </div>
        
        <div className="mt-auto pt-6 border-t border-neutral-700">
          <SidebarLink 
            link={socialLinks[socialLinks.length - 1]} 
            className="cursor-default hover:no-underline"
          />
        </div>
      </div>
    </div>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props}>
        <SidebarContent />
      </DesktopSidebar>
      <MobileSidebar {...(props as React.ComponentProps<"div">)}>
        <SidebarContent />
      </MobileSidebar>
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-screen fixed left-0 top-0 px-4 py-8 hidden md:flex md:flex-col bg-neutral-800 dark:bg-neutral-900 z-50",
        className
      )}
      animate={{
        width: animate ? (open ? "280px" : "90px") : "280px",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-14 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-800 dark:bg-neutral-900 w-full fixed top-0 left-0"
      )}
      {...props}
    >
      <div className="flex justify-end z-20 w-full">
        <IconMenu2
          className="text-neutral-200"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-neutral-800 dark:bg-neutral-900 p-10 z-[100]",
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            <div className="flex justify-center items-start h-full w-full">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  const isProfile = link.label === "Garvit";
  
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center relative group h-12 transition-all duration-200 hover:bg-neutral-700/30 rounded-lg", // Added hover background
        isProfile ? "mt-auto" : "",
        className
      )}
      {...props}
    >
      {/* Fixed position container for icon */}
      <div className={cn(
        "absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1", // Added hover transform
        isProfile && "left-3"
      )}>
        {link.icon}
      </div>
      
      {/* Text container */}
      <motion.div
        className="absolute left-16 flex items-center transition-transform duration-200 group-hover:translate-x-1" // Added hover transform
        initial={false}
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
      >
        <span className={cn(
          "text-neutral-200 whitespace-nowrap transition-colors duration-200 group-hover:text-white",
          "text-lg font-bold",
        )}>
          {link.label}
        </span>
      </motion.div>
    </Link>
  );
};

export default Sidebar;