-- Allow users to update and delete their own analytics snapshots
CREATE POLICY "Users can update their own analytics"
ON public.analytics_snapshots
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics"
ON public.analytics_snapshots
FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to update their own trade screenshot metadata
CREATE POLICY "Users can update their own screenshots"
ON public.trade_screenshots
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);