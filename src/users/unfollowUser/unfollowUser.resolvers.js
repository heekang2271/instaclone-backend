import client from "../../client";
import { protectedResolver } from "../users.utils";

const resolverFn = async (_, { username }, { loggedInUser }) => {
    try {
        const ok = await client.user.findUnique({
            where: { username },
        });
        if (!ok) {
            return {
                ok: false,
                error: "Can't unfollow user.",
            };
        }
        await client.user.update({
            where: {
                id: loggedInUser.id,
            },
            data: {
                following: {
                    disconnect: {
                        username,
                    },
                },
            },
        });
        return {
            ok: true,
        };
    } catch (e) {
        return {
            ok: false,
            error: e.message,
        };
    }
};

export default {
    Mutation: {
        unfollowUser: protectedResolver(resolverFn),
    },
};
