import { Doc, Id } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createDocument = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents"))
    }, 
    handler: async(ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("Not authozincated!")
        }

        const userId = identity.subject
        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPubllished: false
        })

        return document
    } 
})

export const getDocuments = query({
    args: {
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("Not authozincated!")
        }
        const userId = identity.subject
        const documents = await ctx.db.query("documents").withIndex("by_user_parent", (q) => q.eq("userId", userId).eq("parentDocument", args.parentDocument)).filter(q => q.eq(q.field("isArchived"), false)).order("desc").collect()
        return documents
    } 
})

export const archive = mutation({
    args: {
        id: v.id("documents"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error("Not authozincated!")
        }

        const userId = identity.subject
        const existingDocument = await ctx.db.get(args.id)
        if(!existingDocument){
            throw new Error("Not found")
        }

        if(existingDocument.userId !== userId){
            throw new Error("Unathorizated!")
        }

        const archivedChildsDocument = async (documentId: Id<"documents">) => {
            const children = await ctx.db.query("documents").withIndex("by_user_parent", q => q.eq("userId", userId).eq("parentDocument", documentId)).collect()
            for(const child of children){
                await ctx.db.patch(child._id, {
                    isArchived: true
                })

                archivedChildsDocument(child._id)
            }
        }

        const document = await ctx.db.patch(args.id, {
            isArchived: true
        })

        await archivedChildsDocument(args.id)

        return document
    }
})

export const getTrashDocument = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error("Not authozincated!")
        }

        const userId = identity.subject
        const documents = await ctx.db.query("documents").withIndex("by_user", (q) => q.eq("userId", userId)).filter(q => q.eq(q.field("isArchived"), true)).order("desc").collect()
        return documents
    }
})

export const remove = mutation({
    args: {
        id: v.id("documents")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error("Not authozincated!")
        }

        const userId = identity.subject
        const existingDocument = await ctx.db.get(args.id)
        if(!existingDocument){
            throw new Error("Not found")
        }

        if(existingDocument.userId !== userId){
            throw new Error("Unathorizated!")
        }

        const document = await ctx.db.delete(args.id)
        return document
    }
})

export const getDocumentById = query({
    args: {
        id: v.id("documents")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        
        const document = await ctx.db.get(args.id)
        if(!document){
            throw new Error("Not Found")
        }

        if(document.isPubllished && !document.isArchived){
            return document
        }

        if(!identity){
            throw new Error("Not Authorizated")
        }

        const userId = identity.subject
        if(document.userId !== userId){
            throw new Error("Unauthorizated")
        }

        return document
    }
})

export const UpdateField = mutation({
    args: {
        id: v.id("documents"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPubllished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;
        const { id, ...rest } = args
        const existingDocument = await ctx.db.get(args.id);
        if (!existingDocument) {
            throw new Error("Not found");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorized");
        }

        const document = await ctx.db.patch(id, rest)
        return document
    }
})

export const restore = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error("Not authozincated!")
        }

        const userId = identity.subject
        const existingDocument = await ctx.db.get(args.id)
        if(!existingDocument){
            throw new Error("Not found")
        }

        if(existingDocument.userId !== userId){
            throw new Error("Unathorizated!")
        }

        const unarchivedChildsDocument = async (documentId: Id<"documents">) => {
            const children = await ctx.db.query("documents").withIndex("by_user_parent", q => q.eq("userId", userId).eq("parentDocument", documentId)).collect()
            for(const child of children){
                await ctx.db.patch(child._id, {
                    isArchived: false
                })

                unarchivedChildsDocument(child._id)
            }
        }

        const options: Partial<Doc<"documents">> = {
            isArchived: false
        }   
        unarchivedChildsDocument(args.id)
        
        if(existingDocument.parentDocument){
            existingDocument.parentDocument = undefined
        }
        const document = await ctx.db.patch(args.id, options)
        return document
    }
})