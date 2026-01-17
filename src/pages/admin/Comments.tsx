import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PermissionGate } from "@/components/admin/PermissionGate";
import { ADMIN_PERMISSIONS } from "@/hooks/usePermissions";
import { useActivityLog } from "@/hooks/useActivityLog";

interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  admin_reply: string | null;
  created_at: string;
  blog_posts?: {
    title: string;
  };
}

export default function AdminComments() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/auth");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchComments();
    }
  }, [isAdmin]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_comments")
        .select(`
          *,
          blog_posts (
            title
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoadingComments(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("blog_comments")
        .update({ approved: true })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment approved",
      });

      fetchComments();
    } catch (error) {
      console.error("Error approving comment:", error);
      toast({
        title: "Error",
        description: "Failed to approve comment",
        variant: "destructive",
      });
    }
  };

  const handleUnapprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("blog_comments")
        .update({ approved: false })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment unapproved (held for review)",
      });

      fetchComments();
    } catch (error) {
      console.error("Error unapproving comment:", error);
      toast({
        title: "Error",
        description: "Failed to unapprove comment",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("blog_comments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment deleted",
      });

      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("blog_comments")
        .update({
          admin_reply: replyText,
          admin_reply_at: new Date().toISOString(),
          admin_id: user?.id,
        })
        .eq("id", commentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reply added",
      });

      setReplyText("");
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      });
    }
  };

  if (loading || loadingComments) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <PermissionGate permission={ADMIN_PERMISSIONS.MANAGE_COMMENTS}>
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Manage Comments</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Blog Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{comment.author_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {comment.author_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {comment.blog_posts?.title || "Unknown Post"}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="truncate">{comment.content}</p>
                        {comment.admin_reply && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Reply: {comment.admin_reply}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          comment.approved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {comment.approved ? "Approved" : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(comment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {!comment.approved ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(comment.id)}
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnapprove(comment.id)}
                            title="Unapprove (Hold)"
                          >
                            <XCircle className="h-4 w-4 text-yellow-600" />
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReplyingTo(comment.id);
                                setReplyText(comment.admin_reply || "");
                              }}
                              title="Reply"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reply to Comment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Original comment:
                                </p>
                                <p className="p-3 bg-muted rounded">{comment.content}</p>
                              </div>
                              <Textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your reply..."
                                rows={4}
                              />
                              <Button onClick={() => handleReply(comment.id)}>
                                Send Reply
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(comment.id)}
                          title="Delete"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
    </PermissionGate>
  );
}
