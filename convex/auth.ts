import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";

// @ts-ignore @ts-nocheck
import {Password} from "@convex-dev/auth/providers/password";
import type { DataModel } from "./_generated/dataModel";

const CustomPassword = Password<DataModel>({
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    profile(params:any){
      return {
        email: params.email as string,
        name: params.name as string,
    }
  },
})

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [CustomPassword, GitHub, Google],
});
