import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Coins,
  RefreshCw,
  Search,
  Timer,
  Shield,
  GitBranch,
  Link2,
  Code,
  ChevronDown,
  ChevronUp,
  Terminal,
  Check,
  AlertCircle,
  Info,
  Logs,
  Scroll,
  Plus,
  Unlink,
  Trash,
  Pencil,
  Save
} from 'lucide-react';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';
import { toast } from 'sonner';
import { cn } from '@lib/utils';
import { GetStaticProps } from 'next';
import TokenRegistryClient from '@lib/server/registry/registry.client';
import Image from 'next/image';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from '@components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Label } from '@components/ui/label';
import { Alert, AlertDescription } from '@components/ui/alert';

const TokenImage = ({ src, alt }: { src?: string; alt: string }) => {
  if (!src) return null;

  // Safely handle image urls
  const imageUrl = src.startsWith('http') ? src : `/dmg-logo.gif`;

  return (
    <div className="relative overflow-hidden rounded-lg size-10">
      <Image
        src={imageUrl}
        alt={alt}
        width={40}
        height={40}
        className="object-cover"
        onError={e => {
          // Fallback to placeholder on error
          e.currentTarget.src = '/dmg-logo.gif';
        }}
      />
    </div>
  );
};

const client = new TokenRegistryClient();

interface Props {
  data: {
    tokens: any;
    lastUpdate: string;
  };
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Get all prices
  const { tokens } = await client.listAll();

  return {
    props: {
      data: {
        tokens,
        lastUpdate: new Date().toISOString()
      }
    },
    // Revalidate every minute
    revalidate: 60
  };
};

const TokenStatusBadge = ({
  children,
  variant
}: {
  children: React.ReactNode;
  variant: 'mintable' | 'transferable' | 'burnable' | 'lp';
}) => {
  const variants = {
    mintable: 'text-lime-700 dark:text-lime-300',
    transferable: 'text-sky-700 dark:text-sky-300',
    burnable: 'text-amber-700 dark:text-amber-300',
    lp: 'text-violet-700 dark:text-violet-300'
  };

  return (
    <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', variants[variant])}>
      {children}
    </span>
  );
};

const TokenCard = ({ token }: { token: any }) => {
  const [expanded, setExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [operationType, setOperationType] = useState<string>('');
  const [open, setOpen] = useState(false);

  const imageUrl =
    token.metadata?.image_canonical_uri ||
    token.metadata?.image_uri ||
    token.metadata?.images?.logo ||
    token.metadata?.image;

  const getTokenStyle = () => {
    if (token.lpInfo) return 'text-violet-500 dark:text-violet-400';
    if (token.audit?.fungibleTokens?.[0]?.isMintable) return 'text-lime-500 dark:text-lime-400';
    return 'text-sky-500 dark:text-sky-400';
  };

  const handleOperation = async (operation: string) => {
    try {
      setOperationType(operation);
      setDialogOpen(true);
    } catch (error) {
      toast.error(`Failed to ${operation}`);
      console.error(error);
    }
  };

  const handleConfirmOperation = async () => {
    try {
      switch (operationType) {
        case 'remove':
          await client.removeContract(token.contractId);
          break;
        case 'unregisterLp':
          await client.unregisterLpToken(token.contractId, token.lpInfo);
          break;
        case 'refreshMetadata':
          await client.refreshMetadata(token.contractId);
          break;
      }
      toast.success('Operation completed successfully');
      // Trigger refresh
      await fetch('/api/revalidate?path=/debug/registry');
      window.location.reload();
    } catch (error) {
      toast.error('Operation failed');
      console.error(error);
    } finally {
      setDialogOpen(false);
    }
  };

  return (
    <ContextMenu>
      <TokenEditorDialog token={token} open={open} onOpenChange={(v: any) => setOpen(v)} />
      <ContextMenuTrigger>
        <Card className="overflow-hidden border-none">
          <div className="p-4 rounded-lg bg-gray-800/90">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start min-w-0 gap-3">
                {' '}
                {/* added min-w-0 to allow truncation */}
                {imageUrl ? (
                  <TokenImage src={imageUrl} alt={token.metadata?.name || 'Contract'} />
                ) : (
                  <div
                    className={cn(
                      'flex-shrink-0 size-10 rounded-lg flex items-center justify-center'
                    )}
                  >
                    <Scroll className={cn('size-6', getTokenStyle())} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {' '}
                  {/* added min-w-0 and flex-1 */}
                  <div className="font-semibold truncate">
                    {token.metadata?.symbol || token.metadata?.name || 'Unknown Contract'}
                  </div>
                  <div className="text-sm truncate text-muted-foreground">
                    {token.metadata?.description || 'No description'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex-shrink-0 p-1.5 rounded-md hover:bg-accent transition-colors ml-2"
              >
                {expanded ? (
                  <ChevronUp className="size-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-5 text-muted-foreground" />
                )}
              </button>
            </div>

            {/* Contract ID */}
            <div className="flex items-center gap-2 group">
              <code className="flex-1 px-2 py-1.5 text-xs rounded-md bg-background/50 font-mono truncate border border-border/50">
                {token.contractId}
              </code>
              <CopyButton text={token.contractId} />
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Terminal className="size-4" />
                <span className="tabular-nums">{token.stats.interactions}</span> interactions
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Timer className="size-4" />
                {new Date(token.stats.lastSeen).toLocaleString()}
              </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
              <div className="pt-4 mt-4 space-y-6 border-t border-border/50">
                {/* Large Image Display */}
                {imageUrl && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground/80">Contract Image</div>
                    <div className="relative w-32 h-32 mx-auto overflow-hidden rounded-xl bg-background/50">
                      <Image
                        src={imageUrl}
                        alt={token.metadata?.name || 'Contract'}
                        fill
                        className="object-contain"
                        onError={e => {
                          e.currentTarget.src = '/api/placeholder/128/128';
                        }}
                      />
                    </div>
                    <div className="text-xs text-center break-all text-muted-foreground">
                      {imageUrl}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {token.metadata && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground/80">Metadata</div>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(token.metadata)
                        .filter(([key]) => !key.includes('image') && key !== 'lastUpdated')
                        .map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="text-muted-foreground">{key}:</span>
                            <div className="mt-0.5 font-mono text-xs truncate">{String(value)}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Audit Status */}
                {token.audit && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                      <Shield className="size-4" />
                      Contract Audit
                    </div>
                    <div className="space-y-3">
                      {token.audit.fungibleTokens?.map((ft: any, i: number) => (
                        <div
                          key={i}
                          className="p-3 border rounded-lg bg-background/50 border-border/50"
                        >
                          <div className="grid gap-1 mb-2">
                            <div className="text-sm">{ft.name}</div>
                            <div className="text-sm">
                              <span className="mr-1 text-muted-foreground">Asset Identifier: </span>
                              {ft.tokenIdentifier}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* LP Info */}
                {token.lpInfo && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                      <Link2 className="size-4" />
                      LP Token Info
                    </div>
                    <div className="p-3 space-y-2 border rounded-lg bg-background/50 border-border/50">
                      <div className="text-sm">
                        <span className="text-muted-foreground">DEX:</span> {token.lpInfo.dex}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Pool:</span> {token.lpInfo.poolId}
                      </div>
                      <div className="grid gap-1">
                        <div className="font-mono text-xs truncate">
                          <span className="text-muted-foreground">Token0:</span>{' '}
                          {token.lpInfo.token0}
                        </div>
                        <div className="font-mono text-xs truncate">
                          <span className="text-muted-foreground">Token1:</span>{' '}
                          {token.lpInfo.token1}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pools */}
                {token.pools?.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                      <GitBranch className="size-4" />
                      Pool Relationships
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {token.pools.map((poolId: string) => (
                        <div
                          key={poolId}
                          className="px-3 py-1 text-sm rounded-full text-violet-700 bg-violet-100 dark:bg-violet-900/20 dark:text-violet-300"
                        >
                          Pool {poolId}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={() => setOpen(true)} className="gap-2">
          <Pencil className="size-4" />
          Edit Token Data
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Token Operations */}
        <ContextMenuSub>
          <ContextMenuSubTrigger className="gap-2">
            <Shield className="size-4" />
            Token Operations
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => handleOperation('refreshMetadata')} className="gap-2">
              <RefreshCw className="size-4" />
              Update Metadata
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleOperation('remove')}
              className="gap-2 text-red-600"
            >
              <Trash className="size-4" />
              Remove Contract
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* LP Token Operations */}
        {token.lpInfo && (
          <ContextMenuSub>
            <ContextMenuSubTrigger className="gap-2">
              <Link2 className="size-4" />
              LP Operations
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem
                onClick={() => handleOperation('unregisterLp')}
                className="gap-2 text-red-600"
              >
                <Unlink className="size-4" />
                Unregister LP Token
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}

        {/* Pool Operations */}
        {token.pools?.length > 0 && (
          <ContextMenuSub>
            <ContextMenuSubTrigger className="gap-2">
              <GitBranch className="size-4" />
              Pool Operations
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {token.pools.map((poolId: string) => (
                <ContextMenuItem
                  key={poolId}
                  onClick={() => handleOperation(`removePool-${poolId}`)}
                  className="gap-2"
                >
                  <Unlink className="size-4" />
                  Remove Pool {poolId}
                </ContextMenuItem>
              ))}
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => handleOperation('addPool')} className="gap-2">
                <Plus className="size-4" />
                Add New Pool
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}
        <ContextMenuItem
          onClick={() => navigator.clipboard.writeText(token.contractId)}
          className="gap-2"
        >
          <Code className="size-4" />
          Copy Contract ID
        </ContextMenuItem>

        <ContextMenuSeparator />
      </ContextMenuContent>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Operation</DialogTitle>
            <DialogDescription>
              Are you sure you want to {operationType} {token.contractId}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmOperation}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContextMenu>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="transition-opacity opacity-0 group-hover:opacity-100"
    >
      {copied ? (
        <Check className="text-green-500 size-4" />
      ) : (
        <Code className="text-purple-600 size-4 dark:text-purple-400" />
      )}
    </button>
  );
};

export default function TokenRegistryDebug({
  data: { tokens, lastUpdate }
}: {
  data: { tokens: any[]; lastUpdate: string };
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastUpdateDate = new Date(lastUpdate);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetch('/api/revalidate?path=/debug/tokens');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to refresh token data');
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredTokens = tokens.filter(
    token =>
      token.contractId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.metadata?.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(filteredTokens);

  return (
    <div className="container p-6 mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contract Registry Debug</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="size-4" />
            Last update: {lastUpdateDate.toLocaleTimeString()}
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={cn('size-4', isRefreshing && 'animate-spin')} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Search className="size-4 text-muted-foreground" />
        <Input
          placeholder="Search tokens by symbol, name, or contract..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-xl"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredTokens.map(token => (
          <TokenCard key={token.contractId} token={token} />
        ))}
      </div>
    </div>
  );
}

const TokenEditorDialog = ({ token, open, onOpenChange }: any) => {
  const [editedData, setEditedData] = useState(null as any);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadataError, setMetadataError] = useState('');
  const [auditError, setAuditError] = useState('');

  useEffect(() => {
    if (open && token) {
      setEditedData(token);
      setMetadataError('');
      setAuditError('');
      setError(null);
    }
  }, [open, token]);

  const handleSave = async () => {
    if (metadataError) {
      toast.error('Please fix metadata JSON errors before saving');
      return;
    }
    if (auditError) {
      toast.error('Please fix audit JSON errors before saving');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Update metadata if changed
      if (editedData.metadata) {
        await client.updateMetadata(editedData.contractId, editedData.metadata);
      }

      // Update audit if changed
      if (editedData.audit) {
        await client.updateAudit(editedData.contractId, editedData.audit);
      }

      // Update LP info if changed
      if (editedData.lpInfo) {
        await client.registerLpToken(editedData.contractId, editedData.lpInfo);
      }

      toast.success('Token updated successfully');
    } catch (err) {
      setError((err as any).message);
      toast.error('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const handleMetadataChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setEditedData((prev: any) => ({
        ...prev,
        metadata: parsed
      }));
      setMetadataError('');
    } catch (err) {
      setMetadataError((err as Error).message);
    }
  };

  const handleAuditChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setEditedData((prev: any) => ({
        ...prev,
        audit: parsed
      }));
      setAuditError('');
    } catch (err) {
      setAuditError((err as Error).message);
    }
  };

  const handleLpInfoChange = (field: string, value: string) => {
    setEditedData((prev: any) => ({
      ...prev,
      lpInfo: {
        ...prev.lpInfo,
        [field]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[99vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Token</DialogTitle>
        </DialogHeader>

        {editedData && (
          <div className="space-y-6">
            {/* Contract ID Display */}
            <div className="flex items-center gap-2 px-3 py-2 font-mono text-sm rounded-md">
              {editedData.contractId}
            </div>

            <Tabs defaultValue="metadata" className="w-full">
              <TabsList>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="audit">Audit</TabsTrigger>
                <TabsTrigger value="lpInfo">LP Info</TabsTrigger>
              </TabsList>

              <TabsContent value="metadata" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Token Metadata (JSON)</Label>
                    {metadataError && (
                      <span className="text-xs text-destructive">{metadataError}</span>
                    )}
                  </div>
                  <textarea
                    className={cn(
                      'w-full h-[400px] p-4 font-mono text-sm rounded-md bg-background border focus:outline-none focus:ring-2 focus:ring-ring',
                      metadataError && 'border-destructive'
                    )}
                    value={JSON.stringify(editedData.metadata || {}, null, 2)}
                    onChange={e => handleMetadataChange(e.target.value)}
                    spellCheck={false}
                  />
                </div>
              </TabsContent>

              <TabsContent value="audit" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Token Audit (JSON)</Label>
                    {auditError && <span className="text-xs text-destructive">{auditError}</span>}
                  </div>
                  <textarea
                    className={cn(
                      'w-full h-[400px] p-4 font-mono text-sm rounded-md bg-background border focus:outline-none focus:ring-2 focus:ring-ring',
                      auditError && 'border-destructive'
                    )}
                    value={JSON.stringify(editedData.audit || {}, null, 2)}
                    onChange={e => handleAuditChange(e.target.value)}
                    spellCheck={false}
                  />
                </div>
              </TabsContent>

              <TabsContent value="lpInfo">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>DEX</Label>
                      <Input
                        value={editedData?.lpInfo?.dex || ''}
                        onChange={e => handleLpInfoChange('dex', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pool ID</Label>
                      <Input
                        value={editedData?.lpInfo?.poolId || ''}
                        onChange={e => handleLpInfoChange('poolId', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Token 0</Label>
                      <Input
                        value={editedData?.lpInfo?.token0 || ''}
                        onChange={e => handleLpInfoChange('token0', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Token 1</Label>
                      <Input
                        value={editedData?.lpInfo?.token1 || ''}
                        onChange={e => handleLpInfoChange('token1', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2">
              <Button onClick={handleSave} disabled={loading || !!metadataError}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
